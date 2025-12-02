/**
 * RxClass API Integration
 * 
 * Finds therapeutically equivalent medications using NLM's RxClass API
 * https://lhncbc.nlm.nih.gov/RxNav/APIs/RxClassAPIs.html
 */

const RXCLASS_API_BASE = 'https://rxnav.nlm.nih.gov/REST/rxclass';

export interface RxClassInfo {
  classId: string;
  className: string;
  classType: string;
}

export interface DrugMember {
  rxcui: string;
  name: string;
  tty: string; // Term type: IN=ingredient, PIN=precise ingredient
}

interface RxClassDrugInfoResponse {
  rxclassDrugInfoList?: {
    rxclassDrugInfo: Array<{
      minConcept: {
        rxcui: string;
        name: string;
        tty: string;
      };
      rxclassMinConceptItem: {
        classId: string;
        className: string;
        classType: string;
      };
      rela: string;
      relaSource: string;
    }>;
  };
}

interface ClassMembersResponse {
  drugMemberGroup?: {
    drugMember: Array<{
      minConcept: {
        rxcui: string;
        name: string;
        tty: string;
      };
    }>;
  };
}

/**
 * Get therapeutic classes for a drug by name
 * Uses ATC (Anatomical Therapeutic Chemical) classification
 */
export async function getTherapeuticClasses(drugName: string): Promise<RxClassInfo[]> {
  try {
    const url = `${RXCLASS_API_BASE}/class/byDrugName.json?drugName=${encodeURIComponent(drugName)}&relaSource=ATC`;
    
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`RxClass API error for ${drugName}:`, response.status);
      return [];
    }
    
    const data: RxClassDrugInfoResponse = await response.json();
    
    if (!data.rxclassDrugInfoList?.rxclassDrugInfo) {
      return [];
    }
    
    // Extract unique ATC classes (prefer ATC4 level for specific therapeutic groups)
    const classes = new Map<string, RxClassInfo>();
    
    for (const info of data.rxclassDrugInfoList.rxclassDrugInfo) {
      const classItem = info.rxclassMinConceptItem;
      
      // Prefer ATC4 level (most specific therapeutic subgroup)
      if (classItem.classType === 'ATC4' || classItem.classType === 'ATC3') {
        classes.set(classItem.classId, {
          classId: classItem.classId,
          className: classItem.className,
          classType: classItem.classType,
        });
      }
    }
    
    return Array.from(classes.values());
  } catch (error) {
    console.error('Error fetching therapeutic classes:', error);
    return [];
  }
}

/**
 * Get all drug members of a therapeutic class
 */
export async function getClassMembers(classId: string): Promise<DrugMember[]> {
  try {
    const url = `${RXCLASS_API_BASE}/classMembers.json?classId=${encodeURIComponent(classId)}&relaSource=ATC&ttys=IN`;
    
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`RxClass API error for class ${classId}:`, response.status);
      return [];
    }
    
    const data: ClassMembersResponse = await response.json();
    
    if (!data.drugMemberGroup?.drugMember) {
      return [];
    }
    
    // Return unique ingredients only (avoid duplicates)
    const uniqueDrugs = new Map<string, DrugMember>();
    
    for (const member of data.drugMemberGroup.drugMember) {
      const drug = member.minConcept;
      uniqueDrugs.set(drug.rxcui, {
        rxcui: drug.rxcui,
        name: drug.name,
        tty: drug.tty,
      });
    }
    
    return Array.from(uniqueDrugs.values());
  } catch (error) {
    console.error('Error fetching class members:', error);
    return [];
  }
}

/**
 * Find therapeutic alternatives for a drug
 * Returns drugs in the same therapeutic class
 */
export async function findTherapeuticAlternatives(drugName: string): Promise<DrugMember[]> {
  try {
    // Step 1: Find what therapeutic classes this drug belongs to
    const classes = await getTherapeuticClasses(drugName);
    
    if (classes.length === 0) {
      console.log(`No therapeutic classes found for ${drugName}`);
      return [];
    }
    
    // Step 2: Get members of the most specific class (ATC4 preferred)
    const preferredClass = classes.find(c => c.classType === 'ATC4') || classes[0];
    
    console.log(`Found therapeutic class for ${drugName}:`, preferredClass.className);
    
    const members = await getClassMembers(preferredClass.classId);
    
    // Step 3: Filter out the original drug (case-insensitive)
    const alternatives = members.filter(
      m => m.name.toLowerCase() !== drugName.toLowerCase()
    );
    
    console.log(`Found ${alternatives.length} alternatives for ${drugName}`);
    
    return alternatives;
  } catch (error) {
    console.error('Error finding therapeutic alternatives:', error);
    return [];
  }
}
